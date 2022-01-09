FROM ruby:3.0.1-alpine3.13

ENV APP_PATH=/var/app
ENV BUNDLE_VERSION=2.2.17
ENV RAILS_PORT=3000

ARG RAILS_SERVE_STATIC_FILES=true
ENV RAILS_SERVE_STATIC_FILES ${RAILS_SERVE_STATIC_FILES}

ARG RAILS_ENV=production
ENV RAILS_ENV ${RAILS_ENV}

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh

RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# install dependencies for application
RUN apk -U add --no-cache \
build-base \
git \
postgresql-dev \
postgresql-client \
libxml2-dev \
libxslt-dev \
nodejs \
npm \
yarn \
tzdata \
&& rm -rf /var/cache/apk/* \
&& mkdir -p $APP_PATH 

ENV CC=clang
ENV CXX=clang++
RUN gem install 'specific_install'
RUN gem specific_install -l "https://github.com/sagarjauhari/mini_racer"
RUN gem install bundler --version "$BUNDLE_VERSION"

# navigate to app directory
WORKDIR $APP_PATH


COPY . .
RUN rm -f Gemfile.lock
RUN bundle lock --add-platform x86_64-linux-musl
RUN bundle install
RUN yarn install --check-files

# creating a log directory so that image wont fail when RAILS_LOG_TO_STDOUT is false
RUN mkdir -p /app/log

# generate production assets if production environment
RUN if [ "$RAILS_ENV" = "production" ]; then \
  SECRET_KEY_BASE=precompile_placeholder RAILS_LOG_TO_STDOUT=enabled bundle exec rake assets:precompile \
  && rm -rf spec node_modules tmp/cache; \
  fi

EXPOSE 3000

CMD rails s -p $RAILS_PORT -b 0.0.0.0
