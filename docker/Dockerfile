FROM ghcr.io/usepa/node-20:latest

WORKDIR /rapidtox/

# Set max heap size for node
ENV NODE_OPTIONS="--max_old_space_size=4096"

# COPY ./package.json
# insufficient, gives TypeError: Cannot read property 'options' of undefined
# in build / dev stages
COPY . .

SHELL ["bash", "-c"]

# extra pacakges needed to run Cypress
RUN yarn install --ignore-scripts \
   # localhost -> 0.0.0.0, don't just listen on localhost
   && sed -i "s/host: 'localhost',/host: '0.0.0.0',/" nuxt.config.ts \
   && yarn build

ENTRYPOINT ["bash", "/rapidtox/docker/entry.sh"]

# CMD ["yarn", "dev"]
CMD ["yarn", "start"]
