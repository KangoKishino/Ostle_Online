# Ostle_Online

## Project setup

### envファイル作成

```bash
$ cp app.env.example app.env
$ cp mysql/mysql.env.example mysql/mysql.env
```

### コンテナ起動

```bash
$ docker-compose up -d
```

### データベース作成
```bash
$ docker-compose run --rm app npx sequelize-cli db:migrate
```

### アクセス
```bash
http://localhost:8080/
```
