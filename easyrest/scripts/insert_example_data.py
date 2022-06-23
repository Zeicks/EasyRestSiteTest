"""This script populate Data base with fake data."""

from random import randint, seed, randrange, uniform
import time

from faker import Faker
from passlib.hash import pbkdf2_sha256

from tags_data import Tags
from ..models import Tag, Menu, Restaurant, MenuItem, User, UserRole, Category, Order, OrderAssoc
from menu_data import Menus, Categories, Images
from new_menu_items import Menu_items as Meals
import rest_data


def fill_db(session):
    """
    fill Data base with fake data
    Args:
        session (session object): current session to extract db engine
        using session.get_bind()
    """

    fake = Faker()
    # initialize seeds
    fake.seed_instance(4321)
    seed(4321)  # for randint

    # initialize containers for model objects
    # so later we can use session.add_all()
    # to insert data and maintain relations
    Rest_models = []
    # create tag models using data from tags_data.py
    # **tag extract from object pairs and pass
    # it as key=value arguments
    Tags_models = [Tag(**tag) for tag in Tags]
    # create container for user model
    user_model = []

    # create example user statuses(user types)

    Client = 0
    Owner = 1
    Moderator = 2
    Admin = 3
    Administrator = 4
    Waiter = 5

    UserRoles = [
        UserRole(name='Client'),
        UserRole(name='Owner'),
        UserRole(name='Moderator'),
        UserRole(name='Admin'),
        UserRole(name='Administrator'),
        UserRole(name='Waiter')
    ]

    session.add_all(UserRoles)

    # Create 5 users with role Owner
    # and with hashed password "1111
    number_of_owners = 5
    Users = []
    for i in range(number_of_owners):
        user_name = fake.name()
        Users.append(User(name=user_name,
                          email=user_name.lower().replace(" ", "")+'@test.com',
                          password=pbkdf2_sha256.hash("1111"),
                          role=UserRoles[Owner],
                          phone_number="+38098" + str(1000000 + i),
                          birth_date=fake.date_of_birth(
                              tzinfo=None, minimum_age=18, maximum_age=100)
                          )
                     )
    session.add_all(Users)

    # Restaurant role can be 0-waiting for confirmation, 1-active (confirmed), 2-archived
    rest_status = 0

    Cat_models = [Category(**cat) for cat in Categories]

    meals_len = len(Meals)
    used_images = []
    markup_counter = 0

    for i in range(10):
        if rest_status == 3:
            rest_status = 0
        company_name = fake.company()

        key = True
        while key:
            img_index = randint(0, len(rest_data.Images)-1)
            if img_index not in used_images:
                used_images.append(img_index)
                key = False

        if rest_status == 1:
            markup = str(rest_data.Description_markups[markup_counter])
            markup_counter += 1
        else:
            markup = None

        rest = {
            "name": company_name,
            "address_id": fake.address(),
            "description": fake.text(max_nb_chars=200),
            "phone": "+380362" + str(100000 + i),
            "status": rest_status,
            "creation_date": int(time.time()),
            "image": rest_data.Images[img_index],
            "description_markup": markup
        }
        rest_status = rest_status + 1

        rest_model = Restaurant(**rest)

        Menu_models = [Menu(**menu_dict) for menu_dict in Menus]

        Menu_items_all_cat = []
        menu_item_number = randint(10, 15)
        Menu_item_models = []
        for j in range(menu_item_number):
            menu_item = Meals[randint(0, meals_len-1)]
            menu_item.update({
                "price": randrange(50, 10000, 5),
                "amount": round(uniform(0, 10), 1)
            })
            menu_item_model = MenuItem(**menu_item)
            menu_item_model.category = Cat_models[menu_item["category_id"]]
            Menu_item_models.append(menu_item_model)

        Menu_models[0].menu_items = Menu_item_models
        Menu_models[0].primary = True
        Menu_models[1].image = Images[randint(0, len(Images)-1)]

        # using model relationship defined in models.restaurant
        # asign menu to restaurant
        rest_model.menu = Menu_models

        # using model relationship defined in models.restaurant
        # asign one of 5 users to restaurant
        rest_model.owner = Users[randint(0, 4)]

        # define random number of tags for each restaurant
        tag_number = randint(0, len(Tags) - 1)
        # container for tags
        related_tags = []
        for i in range(tag_number):
            # chose random tag
            tag_id = randint(0, len(Tags) - 1)
            item = Tags_models[tag_id]
            # make sure that tag will not repeat
            if item not in related_tags:
                related_tags.append(item)

        # using model relationship defined in models.restaurant
        # asign tag to restaurant
        rest_model.tags = related_tags

        Rest_models.append(rest_model)

    # add users with hashed password "1111"
    client_models = []
    for i in range(menu_item_number):
        user_name = fake.name()
        current_user = User(name=user_name,
                            email=user_name.lower().replace(" ", "")+'@test.com',
                            password=pbkdf2_sha256.hash("1111"),
                            role=UserRoles[Client],
                            phone_number="+38098" +
                            str(1000000 + number_of_owners + i),
                            birth_date=fake.date_of_birth(tzinfo=None, minimum_age=18, maximum_age=100))
        client_models.append(current_user)

    # add Moderator, Admin
    user_name = fake.name()
    moderator = User(name="Peter Moderator",
                     email='petermoderator'+'@test.com',
                     password=pbkdf2_sha256.hash("1"),
                     role=UserRoles[Moderator],
                     phone_number="+380666666661",
                     birth_date=fake.date_of_birth(tzinfo=None, minimum_age=18, maximum_age=100))
    user_model.append(moderator)

    user_name = fake.name()
    admin = User(name="Steve Admin",
                      email="steveadmin"+'@test.com',
                      password=pbkdf2_sha256.hash("1"),
                      role=UserRoles[Admin],
                      phone_number="+380666666662",
                      birth_date=fake.date_of_birth(tzinfo=None, minimum_age=18, maximum_age=100))
    user_model.append(admin)

    # Add Administrator and 2 Waiters for each restaurant
    order_statuses = [
        # "Draft",
        "Waiting for confirm",
        "Accepted",
        "Assigned waiter",
        "In progress",
        "History"
    ]
    for rest_model in Rest_models:
        user_name = fake.name()
        administrator = User(name=user_name + " The Administrator",
                             email=user_name.lower().replace(" ", "")+'@test.com',
                             password=pbkdf2_sha256.hash("1"),
                             role=UserRoles[Administrator],
                             phone_number="+380666666662",
                             birth_date=fake.date_of_birth(tzinfo=None, minimum_age=18, maximum_age=100))
        user_model.append(administrator)
        rest_model.administrator = administrator
        user_name = fake.name()
        waiter1 = User(name=user_name + " The Waiter 1",
                       email=user_name.lower().replace(" ", "")+'@test.com',
                       password=pbkdf2_sha256.hash("1"),
                       role=UserRoles[Waiter],
                       phone_number="+380666666662",
                       birth_date=fake.date_of_birth(tzinfo=None, minimum_age=18, maximum_age=100))
        user_model.append(waiter1)
        user_name = fake.name()
        waiter2 = User(name=user_name + " The Waiter 2",
                       email=user_name.lower().replace(" ", "")+'@test.com',
                       password=pbkdf2_sha256.hash("1"),
                       role=UserRoles[Waiter],
                       phone_number="+380666666662",
                       birth_date=fake.date_of_birth(tzinfo=None, minimum_age=18, maximum_age=100))
        user_model.append(waiter2)

        waiters = [waiter1, waiter2]
        rest_model.waiters.extend(waiters)

        if rest_model.status != 1:
            continue

        for client_model in client_models:
            for order_status in order_statuses:
                n_items = 5
                order = Order(creation_time=int(time.time()),
                              booked_time=int(time.time()),
                              status=order_status)
                client_model.orders.append(order)
                client_model.orders[-1].restaurant = rest_model
                items = rest_model.menu[0].menu_items[0:n_items]
                order_total = 0
                for i, item in enumerate(items):
                    client_model.orders[-1].items.append(
                        OrderAssoc(quantity=i+1))
                    client_model.orders[-1].items[-1].food = item
                    order_total += item.price*(i+1)
                if order_status != "Draft":
                    client_model.orders[-1].total_price = order_total
                if order_status not in ["Draft", "Accepted", "Waiting for confirm"]:
                    waiter_index = randint(0, 1)
                    client_model.orders[-1].waiter = waiters[waiter_index]

    # insert data into database
    session.add_all(Rest_models)
    session.add_all(user_model)
    session.add_all(client_models)
