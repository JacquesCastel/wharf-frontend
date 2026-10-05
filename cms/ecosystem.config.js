module.exports = { apps: [{
 name: 'wharf-strapi', cwd: '/var/www/wharf-strapi',
 script: '/opt/wharf-node22/current/bin/npm',
 interpreter: '/opt/wharf-node22/current/bin/node', args: 'start',
 env: { NODE_ENV: 'production', HOST: '127.0.0.1', STRAPI_TELEMETRY_DISABLED: 'true', PATH: '/opt/wharf-node22/current/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin' },
}] };
