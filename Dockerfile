FROM python:3.9.18-alpine3.18

RUN apk add --no-cache build-base postgresql-dev gcc python3-dev musl-dev nodejs npm

ARG FLASK_APP
ARG FLASK_ENV
ARG DATABASE_URL
ARG SCHEMA
ARG SECRET_KEY

WORKDIR /var/www

COPY requirements.txt .
RUN pip install -r requirements.txt && pip install psycopg2

COPY . .

# Build frontend (Vite) so Flask can serve from react-vite/dist
RUN npm ci --prefix react-vite && npm run build --prefix react-vite

RUN flask db upgrade
RUN flask seed all

CMD gunicorn app:app
