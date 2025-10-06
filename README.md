# Hyve Storage

> _Last Updated: 18/09/2025_

```bash
# SSH connection string for the azure instance:
ssh -i ~/Documents/hyve-storage/azure_minio_shh_key.pem hyveadmin@4.234.131.233

# Make sure that the user running Minio owns the /data directory:
sudo chown -R hyveadmin:hyveadmin /data

# Ensure the user has read, write & execute permissions:
sudo chmod u+rwx /data

# Restart the Minio service
minio server --address 0.0.0.0:9000 /data
```

## Table of contents

- [Introduction](#introduction)
- [Development](#development)

## Introduction

This project contains the API & Webapp repositories for the Hyve storage application.

The primary aim of the Hyve Storage application is create a Hyve [S3](https://aws.amazon.com/s3/) like storage system for internal use & to be a service that we can provide to customers as an auxiliary to the myHyve portal.

The primary tools / technologies used for this project are:

- [Typescript](https://www.typescriptlang.org/)
- [NextJS](https://nextjs.org/)
- [Express](https://expressjs.com/)
- [MinIO](https://www.min.io/)

# Development

This project is currently under development & therefor no documentation can be found yet. However, below are is a collection of notes for developers to aid in initiating new developers to the project as well as help maintain consistent coding standards.

- Enable auto formatting with prettier (the rc file should be in the root of the project [here](./.prettierrc.yml))
- The webapp uses a mixture if Tailwind & SASS for styling UI components.
- Should there be areas where current features are not implimenet, or whereever seems appropriate, please use the comment flag `//TODO:` to make house keeping easier & more 'searchable'.

## Users
