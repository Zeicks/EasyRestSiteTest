FROM python:2.7

WORKDIR /usr/src/easyrest

COPY setup.py ./

RUN pip install --no-cache-dir -e ".[testing]"
