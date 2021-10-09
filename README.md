# member-notice-slack

This repository is a SlackApp to inform members.

## Usage

Clone from Github.

```zsh
git clone https://github.com/genki-sano/member-notice-slack <your-project-name>
cd <your-project-name>
yarn install
```

login with Google.

```zsh
yarn run clasp login
```

Create new GoogleAppsScript project. (Check [the referrence](https://github.com/google/clasp#create).)

```zsh
yarn run clasp create --type standalone --title "Your GAS Project Name" --rootDir ./dist
```

Push your codes to GAS project.

```zsh
yarn run deploy
```

Visit https://script.google.com/d/{your-script-id}/edit, and try to run your code.

Have a nice hack !

## License

This software is released under the MIT License, see [LICENSE](LICENSE)
