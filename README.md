# SITE (HOME) 
### Builded in VUEJS.  

## How to develop

### Setup
```
npm install
```
### Gulp
```
gulp watch
```
### localhost
```
npm run serve
```


## How to install  

### Setup
```
npm install
```

### Compiles and minifies for production
```
npm run build
```

### Docker
```bash
sudo docker run -it -d -p 2000:80 --restart=always --name unique.admin \
-v /var/www/unique/admin:/var/www/html \
blcoccaro/phpwithsql:v1
```

### meanings 
| location | what |
| -------- | ----- |
| /var/www/unique/admin | where is the build of site (admin) |

### .htaccess
```.htaccess
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

![MC HAMMER](https://camo.githubusercontent.com/294d473d32d1d33750ea6a059bcd44cf31398535/687474703a2f2f692e696d6775722e636f6d2f6163484d3330786c2e6a7067)