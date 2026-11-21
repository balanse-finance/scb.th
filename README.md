# Siam Commercial Bank statement templates

Official Balanse templates for Siam Commercial Bank statements in Thailand. Balanse installs all statement types in this repository as one bank package.

## Contributing

Edit the JSON files directly under `templates/`. The repository suffix identifies the country. Each recipe declares its supported statement languages in `languages`. Update the declarative templates and add synthetic parser examples under `fixtures/`. Keep customer statements and credentials private. Increment each changed template revision, refresh its SHA-256 in `bank.json`, and increase the bank version for shipped content changes. Run `npm ci --ignore-scripts` and `npm test` before opening a pull request.
