variable "aws_region" {
  type    = string
  default = "ap-south-1"
}

variable "public_key_path" {
  type    = string
  default = "~/.ssh/aws-ec2-key.pub"
}

variable "s3_bucket_name" {
  type = string
}
