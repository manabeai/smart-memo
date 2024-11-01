# コンテナ1 - Dockerfile for Rails
FROM ruby:3.3.5

# 必要な依存関係のインストール
RUN apt-get update -qq && \
    apt-get install -y nodejs npm postgresql-client vim && \
    npm install -g yarn


WORKDIR /app
RUN gem install rails

COPY Gemfile Gemfile.lock /app/
RUN bundle install

EXPOSE 3000

CMD ["tail", "-f", "/dev/null"]