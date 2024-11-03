# コンテナ1 - Dockerfile for Rails
FROM ruby:3.3.5

ARG USERNAME=USER
ARG USER_UID=1000
ARG USER_GID=$USER_UID

WORKDIR /app

RUN groupmod --gid $USER_GID $USERNAME \
    && usermod --uid $USER_UID --gid $USER_GID $USERNAME \
    && chown -R $USER_UID:$USER_GID /app/$USERNAME

# 必要な依存関係のインストール
RUN apt-get update -qq && \
    apt-get install -y nodejs npm postgresql-client vim && \
    npm install -g yarn


RUN gem install rails

COPY Gemfile Gemfile.lock /app/
RUN bundle install

EXPOSE 3000

CMD ["tail", "-f", "/dev/null"]