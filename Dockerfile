FROM node:slim

LABEL com.github.actions.name="Terraform Plan Report Generator" \
      com.github.actions.description="Updates Pull Requests with visual diff of Terraform Plan changes" \
      com.github.actions.icon="eye" \
      com.github.actions.color="green" \
      maintainer="Ahmad Nassri <ahmad@ahmadnassri.com>"

RUN mkdir /action
WORKDIR /action

COPY action ./

RUN npm ci --only=prod

ENTRYPOINT ["node", "/action/index.js"]
