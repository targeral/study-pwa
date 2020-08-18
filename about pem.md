https://www.freecodecamp.org/news/how-to-get-https-working-on-your-local-development-environment-in-5-minutes-7af615770eec/

https://stackoverflow.com/questions/12871565/how-to-create-pem-files-for-https-web-server

对于.crt 或者 .key，修改后缀或者添加后缀为pem即可当做https的pem文件。
例如将`/pem/localhost.crt`和`/pem/localhost.key`添加pem后缀，然后执行:

```
http-server -S -C=localhost.crt.pem -K=localhost.key.pem
```
