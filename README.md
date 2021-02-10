# Ostle_Online

## Project setup

### envファイル作成

```bash
/* Windows */
$ ren app.env.example app.env
$ ren mysql/mysql.env.example mysql/mysql.env

/* Mac */
$ mv app.env.example app.env
$ mv mysql/mysql.env.example mysql/mysql.env
```

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

### アクセス
```bash
http://localhost:8080/
```
