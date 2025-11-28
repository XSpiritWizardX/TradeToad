FROM python:3.9.18-alpine3.18

# Build deps for numpy/pandas/sklearn on Alpine
RUN apk add --no-cache \
    build-base \
    python3-dev \
    musl-dev \
    postgresql-dev \
    libffi-dev \
    openblas-dev \
    lapack-dev \
    gfortran

ARG FLASK_APP
ARG FLASK_ENV
ARG DATABASE_URL
ARG SCHEMA
ARG SECRET_KEY



WORKDIR /var/www

COPY requirements.txt .

RUN pip install --upgrade pip setuptools wheel \
    && pip install --no-cache-dir -r requirements.txt \
    && pip install --no-cache-dir psycopg2

COPY . .

RUN flask db upgrade
RUN flask seed all
CMD gunicorn app:app
