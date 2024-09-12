# Showcase

Web app to host personal video library.

To install:

1. Pull git repo.
2. Copy .env.sample to .env
3. Update .env file with correct information including server
   ip address.
4. Create ssl certs by running self-signed.create.sh or copy
   premade certs to ./certs.
5. Build docker compose images using docker compose build in
   folder of repo
6. Run server by running docker compose up -d  in folder of
   repo.

1st run create user that will be the admin.  Login to adminer
using http://<ip>:8080 and edit user role to ADMIN for admin 
user.  After stop the adminer service and only run when 
needed.

Folders:

/api        Expressjs api server
/app_data   Work folder for video files
/certs      SSL certificate store
/client     Reactjs web client
/proxy      nginx web reverse proxy used for production
