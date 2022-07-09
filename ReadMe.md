# Local Cache

[![publish Node.js Package](https://github.com/Deland-Labs/localCache/actions/workflows/publish.yml/badge.svg)][1]

## Usage

```shell
npm config set @deland-labs:registry https://gitlab.com/api/v4/projects/37663507/packages/npm/
npm install @deland-labs/local-cache
```

## Document

```shell
npm start
```

## Publish

```shell
git tag vX.Y.Z HEAD  # Tag names started with "v" will trig CI/CD pipeline

git push origin master --tags
```

[1]: https://github.com/Deland-Labs/localCache/actions/workflows/publish.yml
[2]: https://github.com/settings/tokens
