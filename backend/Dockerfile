FROM python:3.9

WORKDIR /code

COPY requirements.txt .
RUN pip install -r requirements.txt

ENV DOCKERIZE_VERSION v0.6.1
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz

COPY . .
RUN ls -la

EXPOSE 5000

CMD dockerize -wait tcp://db:3306 -timeout 60s && flask run --host=0.0.0.0
