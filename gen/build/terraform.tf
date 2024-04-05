provider "google" {
  project = "go-gen-test"
  region  = "europe-west2-b"
}

resource "google_storage_bucket" "primarybucket" {
  name          = "go-gen-test-uploads"
  location      = "EU"
}

resource "google_secret_manager_secret" "my_secret" {
  provider = google-beta
  secret_id = "my-secret"
}

resource "google_secret_manager_secret_version" "my_secret_version" {
  provider = google-beta
  secret = google_secret_manager_secret.my_secret.id
  secret_data = "my-secret-value"
}