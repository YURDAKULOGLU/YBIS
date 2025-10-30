# Supabase Environment Variables

**File:** `.env.local`  
**Status:** ✅ Configured  
**Last Updated:** 2025-10-29

---

## 🔑 CURRENT CONFIGURATION

```env
# Supabase
SUPABASE_URL=https://friyhdrhkpoztujhhelu.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_UPc8G2vcaUsdaEx7JkrNMA_E53Lbs_E
SUPABASE_SECRET_KEY=sb_secret_AUEuT9qhjeCEPkLEQkohqA_p3maUdDC

# Database
DATABASE_URL=postgresql://postgres:Z3i1ounO6tReC73s@db.friyhdrhkpoztujhhelu.supabase.co:5432/postgres

# App
NODE_ENV=development
```

---

## 📦 USAGE IN CODE

### TypeScript/Node
```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_PUBLISHABLE_KEY!
);
```

### React Native (Expo)
```typescript
import Constants from 'expo-constants';

const supabase = createClient(
  Constants.expoConfig?.extra?.supabaseUrl,
  Constants.expoConfig?.extra?.supabaseAnonKey
);
```

**Note:** For mobile, we'll add to `app.config.ts`:
```typescript
extra: {
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseAnonKey: process.env.SUPABASE_PUBLISHABLE_KEY,
}
```

---

## 🆘 TROUBLESHOOTING

**Error: "supabase is not defined"**
→ Check `.env.local` is in root directory
→ Restart dev server after adding env vars

**Error: "Invalid API key"**
→ Keys expired? Get new ones from Dashboard → Settings → API

**Error: "CORS error"**
→ Check Supabase Dashboard → Settings → API → CORS allowed origins

---

## 🔒 SECURITY

✅ `.env.local` is in `.gitignore`  
✅ Keys are not committed to Git  
✅ Service role key only for server-side  
✅ Publishable key safe for client-side (with RLS)

---

## 🚀 NEXT STEPS

1. ✅ Environment configured
2. ⏭️ Create test user (Dashboard or Auth API)
3. ⏭️ Story 3.3: AuthPort implementation
4. ⏭️ Story 3.4: Mobile auth screens

---

**Ready to code!** 🎯
