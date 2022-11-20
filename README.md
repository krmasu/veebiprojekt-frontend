# Frontend Setup

## Setup in server

### Steps
- Install dependencies
- Setup nginx reverse proxy
- Setup gitlab runner
- Create necessary files in specified locations in the server
- run Gitlab pipeline

### Dependencies

#### Install Docker and Docker-compose
- Update system:
    ```
    sudo apt-get update
    sudo apt-get install \
    ca-certificates \
    curl \
    gnupg \
    lsb-release
    ```
- add dockers gpg key:
    ```
    sudo mkdir -p /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    ```
- Set up the repository:
    ```
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    ```
- Install docker and docker-compose: `sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin`
- Verify installation: `sudo docker run hello-world`
- Enable service `sudo systemctl enable --now docker`
- Confirm installation `docker --version`
- Confirm docker-compose `docker-compose --version`

#### Install Gitlab runner
- Download the binary for your system: `sudo curl -L --output /usr/local/bin/gitlab-runner https://gitlab-runner-downloads.s3.amazonaws.com/latest/binaries/gitlab-runner-linux-amd64`
- Give it permission to execute: `sudo chmod +x /usr/local/bin/gitlab-runner`
- Create a GitLab Runner user: `sudo useradd --comment 'GitLab Runner' --create-home gitlab-runner --shell /bin/bash`
- Install and run as a service:
  ```
  sudo gitlab-runner install --user=gitlab-runner --working-directory=/home/gitlab-runner
  sudo gitlab-runner start
  ```

#### Register Gitlab runner
- In gitlab on your project page go to Settings > CI/CD > Runners
- There you can find the URL and registration token.
- Run `gitlab-runner register`
- Enter the URL `https://gitlab.cs.ttu.ee/`
- Enter the registration token `GR1348941LR37xkACSNqQjnEGGdtj`
- Enter description: `Backend runner`
- Enter tag: `backend-runner`
- Enter executor: `shell`

### Nginx setup
- in /etc/nginx/sites-available/default, without comments the file should look like this:
  ```
  listen 80 default_server;
  root /var/www/html;
  
  index index.html index.htm index.nginx-debian.html;
  
  server_name _;
  
  location / {
          proxy_pass http://localhost:8081;
  }
  
  location /api {
          proxy_pass http://localhost:8080/api;
  }
  ```

### File contents
File locations in the server.
```
opt
`-- web-project
    |-- backend
    |   |-- application.properties
    |   `-- docker-compose.yml
    |-- db
    |   |-- docker-compose.yml
    |   `-- postgres-data
    `-- frontend
        `-- docker-compose.yml
```
/opt/web-project/frontend/docker-compose.yml
```
version: "3.7"
services:
    web-project-frontend:
        image: veebiprojekt-frontend:latest
        container_name: veebiprojekt-frontend
        ports:
            - "8081:8080"
```


## Setup locally for development

### Setup steps
- Install dependencies
- Make sure docker is running
- Git clone: `git clone https://gitlab.cs.ttu.ee/andrsa/veebiprojekt-frontend.git`
- Build Docker image: `docker build -t veebiprojekt-frontend .`
- In project folder: `docker-compose up`

### Links
[Wiki](https://gitlab.cs.ttu.ee/andrsa/veebiprojekt-backend/-/wikis/home) <br>
[Backend repository](https://gitlab.cs.ttu.ee/andrsa/veebiprojekt-backend)
