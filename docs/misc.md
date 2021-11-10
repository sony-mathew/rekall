## Features

* Uses [Tailwind CSS](https://tailwindcss.com).
* `rake setup` to set sensible sample data including user `oliver@example.com` with password `welcome`.
* Uses [devise](https://github.com/plataformatec/devise).
* Heroku ready. Push to Heroku and it will work.
* Uses [Honeybadger](https://www.honeybadger.io/).
* Uses slim for cleaner syntax over erb and better performance over haml.
* Uses [ActiveAdmin](http://activeadmin.info).
* Uses [Sidekiq](https://github.com/mperham/sidekiq).
* Intercepts all outgoing emails in non production environment using gem [mail_interceptor](https://github.com/bigbinary/mail_interceptor).
* Uses PostgreSQL.
* Content compression via [Rack::Deflater](https://github.com/rack/rack/blob/master/lib/rack/deflater.rb).
* Auto-formats Ruby code with [rubocop](https://github.com/bbatsov/rubocop).
* Auto-formats JavaScript and CSS code with [prettier](https://github.com/prettier/prettier).
* Performs background job processing "inline" for heroku env. It means heroku can deliver emails.
* Letter opener gem for development.