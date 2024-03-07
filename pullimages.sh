#!/bin/bash

images=( \
  veupathdb/eda-data \
  veupathdb/rserve \
  veupathdb/eda-compute \
  veupathdb/eda-subsetting \
  veupathdb/dataset-access-service \
  veupathdb/eda-user \
  veupathdb/eda-merging \
  veupathdb/dataset-download-service \
)

for image in "${images[@]}"; do
    echo "Starting pull of $image"
    docker pull $image
done
