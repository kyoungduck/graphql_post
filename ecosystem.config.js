
module.exports = {
    apps: [
        {
            name: 'graphql-post-server',
            script: 'build/index.js',
            instances: 0,
            exec_mode: 'cluster',
        },
    ],
};
