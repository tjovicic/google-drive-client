# Google Drive client

It is a simple Google Drive client for accessing files and shared drives deployed in GCP Cloud Run.
 

## Run
`node install && docker-compose up -d`

## Stop
`docker-compose down --rmi all -v --remove-orphans`

## Cloud Run

```
{
  gcloud config set run/region <region>
  gcloud builds submit --tag gcr.io/<project>/google-drive-client
  gcloud beta run deploy google-drive-client \
  --image gcr.io/<project>/google-drive-client \
  --platform managed \
  --region <region>
}
```
