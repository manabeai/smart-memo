# コンテナ1 - Dockerfile for Rails
FROM ruby:3.3.5

WORKDIR /app
ARG USERNAME=USER
ARG USER_UID=1234
ARG USER_GID=$USER_UID

RUN groupadd --gid $USER_GID $USERNAME \
    && useradd --uid $USER_UID --gid $USER_GID -m $USERNAME \

    && apt-get update \
    && apt-get install -y sudo \
    && echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME \
    && chown -R $USER_UID:$USER_GID /app

RUN apt-get update -qq && \
    apt-get install -y nodejs npm postgresql-client vim && \
    npm install -g yarn

USER $USERNAME

RUN gem install rails

# COPY Gemfile Gemfile.lock /app/
# RUN bundle install

EXPOSE 3000

CMD ["tail", "-f", "/dev/null"]