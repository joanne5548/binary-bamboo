# Binary Bamboo

**Get pet panda in your terminal :panda_face:**

## Preview
![landing image](example.png)

## Features
- Interactive Terminal UI
- Create and choose actions on pets
- Concurrent state changes reflected to UI


## Tech Stack
- Python (CLI)
- Node.js (Microservices)
- Kafka (Message streams)
- Redis (Cache database)


## Directory Structure
1. `/client`
    - Contains Terminal UI application
2. `/services`
    - Contains 3 backend services and a dependency (libs) directory


## Architecture
Event-driven microservices with real-time state synchronization. See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed design decisions and data flow.


## Installation
Frist, clone the repo:
```
git clone https://github.com/joanne5548/binary-bamboo.git
```


### Server
Prerequisite: Docker Desktop is installed and running.

First, run Docker container:
```bash
cd services
docker compose up -d
```

And install dependencies & run microservices:
```bash
npm i && npm run dev
```
> [!Note] Servers might not connect to Kafka on first try. If error message "This server does not host this topic-partition" is observed, terminate current process, and re-try the above command.


### Client
Go back to root directory.
Set up a virtual environment using either:

1. Conda (Recommended)
```bash
cd client
conda env create -f environment.yml
conda activate bamboo
```

2. Pip
```bash
cd client
# Activate virtual environment
pip install -r requirements.txt
```

And run the CLI:
```bash
python src/main.py
```


## Environment Variables
Note that setting up environment variables is not a requirement for this application.
### Frontend
Placed in `/client` directory.
1. `SERVER_DOMAIN`: Server domain. Default: localhost
2. `PORT`: Port # to send API requests. Default: 8080

### Backend
#### API
Placed in `/server/api` directory.
1. `SERVER_DOMAIN`: Server domain. Default: localhost
2. `PORT`: Port # to send API requests. Default: 8080


## Contact
**Joanne Kim** </br>
You can reach me at: joanne.kim0328@gmail.com </br>
[Visit my website!](joannekim.dev) | [LinkedIn](https://www.linkedin.com/in/jkim0328)