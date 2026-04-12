# UptimeRobot Setup — YieldField

## Prérequis

- Compte UptimeRobot gratuit : https://uptimerobot.com/signUp

## Configuration du monitor

1. **Se connecter** sur https://dashboard.uptimerobot.com
2. **Add New Monitor** :
   - Type : `HTTP(s) - Keyword`
   - Friendly Name : `YieldField Production`
   - URL : `https://yieldfield.io/api/health`
   - Keyword Type : `Keyword Exists`
   - Keyword Value : `"ok"`
   - Monitoring Interval : `5 minutes`
3. **Alert Contact** : Ajouter l'email de Bryan
4. **Save**

## Health endpoint

- URL : `/api/health`
- Réponse : `{ "status": "ok", "timestamp": "...", "version": "0.1.0" }`
- HTTP 200 si tout va bien

## Status page publique (optionnel)

1. Dashboard > Status Pages > Add Status Page
2. Ajouter le monitor YieldField
3. URL publique générée : `https://stats.uptimerobot.com/xxxxx`
4. Linkable dans le README ou footer

## Alertes

- Email à Bryan si downtime > 5 min
- Optionnel : Webhook vers Slack/Discord
