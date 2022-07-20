# Yummy English

## I. Project Structure

```
└── root
    ├── apps
    │   ├── client
    │   │   ├── <client-1>
    │   │   │   ├── pages
    │   │   │   └── public
    │   │   └── <client-2>
    │   └── server
    │       ├── <server-1>
    │       └── <server-2>
    └── libs
        ├── client (dir)
        │   ├── <client-1> (dir)
        │   │   ├── core (lib)                                                <-- nx g @nrwl/react:lib core --directory client/<client-1>
        │   │   ├── <feature-1> (dir)
        │   │   │   ├── data-access (lib)                                     <-- nx g @nrwl/workspace:lib data-access --directory client/<client-1>/<feature-1>
        │   │   │   ├── feature (dir)
        │   │   │   │   ├── <sub-feature-1> (lib)                             <-- nx g @nrwl/react:lib <sub-feature-1> --directory client/<client-1>/<feature-1>/feature
        │   │   │   │   └── <sub-feature-2> (lib)                             <-- nx g @nrwl/react:lib <sub-feature-2> --directory client/<client-1>/<feature-2>/feature
        │   │   │   └── ui (lib)                                              <-- nx g @nrwl/react:lib ui --directory client/<client-1>/<feature-1>
        │   │   │       └── <component-name> (dir or file)
        │   │   ├── <feature-2> (dir) 
        │   │   │   ├── data-access (lib) 
        │   │   │   ├── feature (lib)                                         <-- nx g @nrwl/react:lib feature --directory client/<client-1>/<feature-2>
        │   │   │   └── ui (lib)
        │   │   │       └── <component-name> (dir or file)
        │   │   └── shared (dir)
        │   │       ├── data-access (lib)                                     <-- nx g @nrwl/workspace:lib data-access --directory client/<client-1>/shared
        │   │       ├── utils (lib)                                           <-- nx g @nrwl/workspace:lib utils --directory client/<client-1>/shared
        │   │       ├── ui (lib)                                              <-- nx g @nrwl/react:lib ui --directory client/<client-1>/shared
        │   │       └── ...others (lib)
        │   ├── <client-2> (dir)
        │   └── shared (dir)
        │       ├── data-access (lib)                                         <-- nx g @nrwl/nest:lib data-access --directory client/shared
        │       ├── ui (lib)                                                  <-- nx g @nrwl/nest:lib ui --directory client/shared
        │       ├── utils (lib)                                               <-- nx g @nrwl/nest:lib utils --directory client/shared
        │       └── ...others (lib)
        ├── server (dir)
        │   ├── <server-1> (dir)
        │   │   ├── core (lib)                                                <-- nx g @nrwl/nest:lib core --directory server/<server-1>
        │   │   ├── <feature-name-1> (dir)
        │   │   │   ├── data-access (dir)
        │   │   │   │  ├── entities (lib)                                     <-- nx g @nrwl/workspace:lib entities --directory server/<server-1>/<feature-name-1>/data-access
        │   │   │   │  ├── services (lib)                                     <-- nx g @nrwl/workspace:lib services --directory server/<server-1>/<feature-name-1>/data-access
        │   │   │   │  └── types (lib)                                        <-- nx g @nrwl/workspace:lib types --directory server/<server-1>/<feature-name-1>/data-access
        │   │   │   └── feature (lib)                                         <-- nx g @nrwl/nest:lib feature --directory server/<server-name-1>/<feature-name-1>
        │   │   ├── <feature-name-2> (dir)
        │   │   │   ├── data-access (dir)
        │   │   │   │  ├── entities (lib)
        │   │   │   │  ├── services (lib)
        │   │   │   │  └── types (lib)
        │   │   │   └── feature (lib) 
        |   |   └── shared (dir)
        |   |       ├── data-access (lib)                                     <-- nx g @nrwl/nest:lib data-access --directory server/<server-name-1>/shared
        |   |       ├── utils (lib)                                           <-- nx g @nrwl/nest:lib utils --directory server/<server-name-1>/shared
        |   |       └── ...others (lib)
        │   ├── <server-name-2> (dir)
        │   └── shared (dir)
        |       ├── auth (lib)                                                <-- nx g @nrwl/workspace:lib auth --directory server/shared
        |       ├── modules (lib)                                             <-- nx g @nrwl/workspace:lib modules --directory server/shared
        |       ├── helpers (lib)                                             <-- nx g @nrwl/workspace:lib helpers --directory server/shared
        |       ├── utils (lib)                                               <-- nx g @nrwl/workspace:lib utils --directory server/shared
        |       └── ...others (lib)
        └── shared (dir)
            ├── assets (lib)                                                  <-- nx g @nrwl/workspace:lib assets --directory shared
            ├── data-access (lib)                                             <-- nx g @nrwl/workspace:lib data-access --directory shared
            ├── utils (lib)                                                   <-- nx g @nrwl/workspace:lib utils --directory shared
            └── ...others (lib)
```

## II. Prerequisites
- Install docker and docker-compose
- NodeJS version 14.19.3
- Install nx cli `npm install -g nx`
- Install all dependencies by run `yarn`
- Copy env to .env for server and on each clients
- Init husky run `npx husky-init && yarn husky add .husky/pre-commit "yarn lint-staged"` then delete `npm test` in *.husky/pre-commit.bash* and `"prepare": "husky install"` in *package.json*
- Set up fake domain in nginx config for your os (linux: /etc/hosts) `127.0.0.1 app.els.com guardian.els.com api.els.com minio.els.com minio-ui.els.com`

## III. RUN
1. run `docker-compose up mongo redis nginx postgres minio rabbitmq kratos-migrate kratos graphql-engine` to start all data container
2. restore database *els* `docker exec -i els-postgres psql -U postgres els <` <dump_file>
3. restore database *kratos* `docker exec -i els-postgres psql -U postgres kratos <` <dump_file>
> *dump_file* in *dump* folder
4. run server
   + `docker-compose up server-learning`
   + `docker-compose up server-dictionary`
   + `docker-compose up server-guardian`
   + `docker-compose up server-notification`
   + `docker-compose up server-worker`
   + `docker-compose up server-gfg`
5. run client
   + `docker-compose up client-guardian`
   + `docker-compose up client-app`
6. run tracer
   + `git clone -b main https://github.com/SigNoz/signoz.git && cd signoz/deploy/`
   + `./install.sh`

## IV. Command
### 1. Common
- Run `nx dep-graph` to see a diagram of the dependencies of your projects.
- Add `--dry-run` at the end command to view verbose of command, this command will be not executed
- Run `nx g @nrwl/workspace:lib <lib-name>` to generate lib by Nx core (optional `--directory <nested-lib>`)
- Run `nx g @nrwl/workspace:move --project <old-workspace> <new-directory>`, (ex: `nx g @nrwl/workspace:move --project server-api server/learning --dry-run`)
- Run `nx g @nrwl/workspace:remove <workspace-name>` remove workspace
- Run `yarn ngrok --port <port>` to expose port with ngrok (optional `--authtoken`, `--region`, `--proto`, ex: `yarn ngrok --port 5000`)
### 2. Client command

- Run `nx g @nrwl/next:app app` to generate Next app
- Run `nx g @nrwl/next:page about --project <project-name>` to add new page to project (optional `--directory <nested-page>`)
- Run `nx g @nrwl/react:lib <feature-name> --directory <project-directory>` to add new feature
- Run `nx g @nrwl/react:component <component-name> --project <project-name> --skipTests` to add component project
- Run `nx g @nrwl/react:stories --project <project-name>` to generate story for existing lib folder of components
- Run `nx g @nrwl/react:storybook-configuration --name <project-name>` to config library with storybook
- Run `nx run <project-name>:storybook` start storybook server

### 3. Server command

- Run `nx generate @nrwl/nest:application <app-name>` to generate Nest app
- Run `nx generate @nrwl/nest:library <nest-lib>` to generate lib with NX NestJS schematics (optional `--directory <nested-lib>`, [--controller] [--service] [--global])
- Run `nx g @nrwl/nest:lib feature --directory <nest-app-dir/feature-name>` to make Nest lib
- Run `nx g @nrwl/workspace:lib services --directory server/<service-name>/<feature-name>/data-access` to make service lib for feature
- Run `nx g @nrwl/workspace:lib entities --directory server/<service-name>/<feature-name>/data-access` to make entity lib for feature
- Run `nx g @nrwl/workspace:lib types --directory server/<service-name>/<feature-name>/data-access` to make entity lib for feature
- To generate other resources with Nx Nest schematics, let jump to Nx Console
- Run `yarn crei --service=<service-name>` to create entities index (ex: `yarn crei --service=learning`)

### 4. Coding convention
- Run `nx run-many --all --target=lint` to check linter all project
- Run `nx lint <workspace-name>` to scan linter for this workspace
- Run `nx format:check <workspace-name>` to scan format for this workspace
- **Can file workspace-name in file workspace.json**

> **1. Frontend(Next + Typescript + Monorepo)**
> **2. Backend(Nest + Monorepo)**
>   1. private variable must have prefix `_` and `readonly` (ex: `private readonly _userService: UserService`)
>   2. GraphQL path
>   + CRUD `resource` -> `resource.resolver.ts`: handle query requests, link @Mutation `resource-mutation.resolver.ts`, allow deep relation (ex: user, company, department,...)
>   + IMPLEMENT `resource` -> `resource.resolver.ts`: link @Query to `resource-queries.resolver.ts` link @Mutation `resource-mutation.resolver.ts`, not allow deep relation (ex: session, testing, auth,...)

## V. Fix common error
1. rebuild grpc
  - Run `docker exec -it {docker_id} bash`
  - And run inside `npm rebuild grpc`

2. stop apache 2 on ubuntu
  - Run `sudo service apache2 stop`

3. set domain in docker
  - run `docker inspect els-nginx` => get Networks els IPAddress
  - run `docker exec -it els-app bash` => run `echo "{Networks_els_IPAddress} minio.els.com" >> /etc/hosts`
  - run `docker exec -it els-guardian bash` => run `echo "{Networks_els_IPAddress} minio.els.com" >> /etc/hosts`
  - run `docker exec -it els-learning bash` => run `echo "{Networks_els_IPAddress} minio.els.com" >> /etc/hosts`
4. Allow firebase pass certificate ssl
   - run `google-chrome --ignore-certificate-errors --unsafely-treat-insecure-origin-as-secure=https://127.0.0.1 --user-data-dir=/tmp/foo`

## VI. Create self certificate nginx
- `sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ./ssl/els.com.key -out ./ssl/els.com.crt`

## VII. Docker
- RUN `DOCKER_BUILDKIT=1 docker build -f .deploy/prod/Dockerfile --tag registry.gitlab.com/php-software-team/els/english-learning-system/<service-name>:<tag> --tag registry.gitlab.com/php-software-team/els/english-learning-system/<service-name>:latest --target runner-<app-layer> --build-arg APP_LAYER=<app-layer> --build-arg APP_NAME=<app-name> --no-cache .` to manual build

> **NOTE**
> - `service-name`: client-app, client-guardian, server-learning,...
> - `tag`: tag version or `git rev-parse --short=10 HEAD`
> - `app-layer`: *client* or *server*
> - `app-name`: *app*, *guardian*, *learning*, *dictionary*,...
## VIII. Run sonar-scanner in local
**Step 1**: Install sonar-scanner for linux. Download sonar-scanner in official page: https://docs.sonarqube.org/latest/analysis/scan/sonarscanner/

**Step 2**: Export environment.
  > nano ~/.bashrc
  or
  > nano ~/.zshrc

Add the following script at the end of file.
  > export PATH="$PATH:<path-to-sonar-scanner>"

Example:
  > export PATH="$PATH:/var/opt/sonar-scanner-4.7.0.2747-linux/bin"
  
**Step 3**: Update config
  > source ~/.bashrc

**Step 4**: RUN sonar-scanner
  > 
  ```
  sonar-scanner \
  -Dsonar.projectKey=your-project-key \
  -Dsonar.sources=. \
  -Dsonar.host.url=http://192.168.1.45:9000 \
  -Dsonar.login=$SONAR_TOKEN
  ```

## IX. Reference

- https://www.duolingo.com/learn
- https://my.babbel.com/course-overview/en/learn_languages/QMS?ref=navbar
- https://app.memrise.com/courses/english/
- https://www.busuu.com/dashboard#/timeline
- https://app.mondly.com/home?tab=findContent
- http://www.lingualia.com/wall/
- https://www.clozemaster.com/l/eng-vie

