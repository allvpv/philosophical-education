```
export BACKUP=/example/philosophy/backup
export REPO="$(realpath ..)"

for template in *.template; do
    envsubst < ${template} >| ${template%.*}
done

for service in *.service; do
    systemd-analyze verify ${service}       &&
    systemctl enable $(realpath ${service}) &&
    systemctl start ${service}              &&
    systemctl status ${service}
done

systemd-analyze verify backup.timer
systemctl enable backup.timer
systemctl start backup.timer
systemctl status backup.timer
```
