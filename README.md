# Ostle_Online

## Project setup

### コンテナ起動

```bash
$ docker-compose up -d
```

### データベース作成
```bash
$ docker-compose run --rm app npx sequelize-cli db:migrate
```

### ビルド
```bash
$ docker-compose exec web sh
$ cd app
$ npm run serve
```
