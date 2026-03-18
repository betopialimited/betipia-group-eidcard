module.exports = {
  apps: [
    {
      name: "betipia-group-eidcard",
      cwd: "/opt/betipia-group-eidcard",
      script: "npm",
      args: "run start:prod",
      env: {
        NODE_ENV: "production",
        PORT: "7000",
        HOSTNAME: "127.0.0.1",
      },
    },
  ],
};
