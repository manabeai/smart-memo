#!/bin/bash

RAILS_ENV=test DISABLE_DATABASE_ENVIRONMENT_CHECK=1 bundle exec rake db:drop
rails db:create # RAILS_ENV=prouction
rails db:migrate # RAILS_ENV=prouction
rails db:seed # RAILS_ENV=prouction

rails s -b 0.0.0.0
