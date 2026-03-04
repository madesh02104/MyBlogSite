output "ec2_public_ip" {
  value = aws_instance.blog_server.public_ip
}

output "s3_bucket_name" {
  value = aws_s3_bucket.blog_images.bucket
}

output "ssh_command" {
  value = "ssh -i ~/.ssh/aws-ec2-key ubuntu@${aws_instance.blog_server.public_ip}"
}
