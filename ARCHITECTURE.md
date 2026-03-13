# PayGenius Frontend — Architecture & Theming

## Folder structure

```
paygenius/
├── App.tsx                 # Root: QueryClient, SafeArea, Theme, Auth, Navigation
├── index.ts                # Entry
├── src/
│   ├── components/         # Reusable UI (use theme via useTheme())
│   │   ├── ThemedView.tsx
│   │   ├── ThemedText.tsx
│   │   ├── ThemedButton.tsx
│   │   ├── ThemeToggle.tsx
│   │   └── index.ts
│   ├── context/            # React Context
│   │   ├── ThemeContext.tsx
│   │   ├── AuthContext.tsx
│   │   └── index.ts
│   ├── constants/          # Layout / responsive base values
│   │   ├── layout.ts       # BASE_SCREEN_WIDTH, BASE_SCREEN_HEIGHT, BREAKPOINTS
│   │   └── index.ts
│   ├── hooks/              # Custom hooks
│   │   ├── useTheme.ts
│   │   ├── useResponsive.ts
│   │   └── index.ts
│   ├── utils/              # Pure helpers
│   │   ├── responsive.ts   # horizontalScale, verticalScale, moderateScale, fontScale
│   │   └── index.ts
│   ├── navigation/         # React Navigation
│   │   ├── RootNavigator.tsx
│   │   └── index.ts
│   ├── screens/            # One folder per screen (see Code standards: 350-line limit)
│   │   ├── Splash/
│   │   │   ├── SplashScreen.tsx
│   │   │   ├── SplashLetter.tsx
│   │   │   ├── splashScreen.styles.ts
│   │   │   ├── constants.ts
│   │   │   └── index.ts
│   │   ├── Home/
│   │   │   ├── HomeScreen.tsx
│   │   │   └── index.ts
│   │   ├── Login/
│   │   │   ├── LoginScreen.tsx
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── services/           # API: Axios + React Query (per-domain)
│   │   ├── api/
│   │   │   └── http.ts     # Axios client, auth header from store
│   │   ├── auth/           # auth.endpoints, .type, .api, .query
│   │   ├── home/
│   │   ├── profile/
│   │   ├── budget/
│   │   ├── wallet/
│   │   └── index.ts
│   ├── stores/             # Zustand state
│   │   ├── auth.store.ts
│   │   └── index.ts
│   ├── theme/              # Colors and semantic tokens
│   │   ├── palettes.ts     # Raw palettes (green, purple, white, black, blue)
│   │   ├── semantic.ts     # Light/dark semantic tokens
│   │   └── index.ts
│   └── types/              # TypeScript types (aligned with backend)
│       ├── api.ts
│       └── index.ts
├── assets/
└── package.json
```

## How theming works (no one-by-one dark mode)

**Rule: use semantic tokens from `useTheme()`, not raw hex colors.**

- **ThemeProvider** holds the current mode (`light` | `dark` | `system`) and exposes **`colors`**, which is either `lightColors` or `darkColors` from `src/theme/semantic.ts`.
- When the user switches theme, `colors` changes. Any component that uses `useTheme().colors` re-renders with the correct palette. You **do not** add dark variants in every screen.

### 1. Use themed components

Prefer built-in components that already use theme:

- **`ThemedView`** — `backgroundColor` comes from theme (`background` | `surface` | `surfaceElevated`).
- **`ThemedText`** — `color` from theme (`primary` | `secondary` | `muted` | `inverse`).
- **`ThemedButton`** — primary/secondary/outline use theme colors.
- **`ThemeToggle`** — cycles light / dark / system.

Example:

```tsx
<ThemedView variant="surface">
  <ThemedText variant="primary">Hello</ThemedText>
  <ThemedText variant="secondary">Subtitle</ThemedText>
</ThemedView>
```

When you switch to dark mode, background and text update automatically.

### 2. Use `useTheme()` for custom styles

When you need a one-off style (e.g. border, icon color):

```tsx
import { useTheme } from "../context/ThemeContext";

function MyCard() {
  const { colors } = useTheme();
  return (
    <View
      style={{ backgroundColor: colors.surface, borderColor: colors.border }}
    >
      <Text style={{ color: colors.text }}>Card</Text>
    </View>
  );
}
```

Use **semantic keys** (`colors.text`, `colors.primary`, `colors.border`, etc.), not hex. Semantic keys are listed in `src/theme/semantic.ts` and in the table below.

### 3. Semantic color keys

| Key                                                    | Use for                       |
| ------------------------------------------------------ | ----------------------------- |
| `background`                                           | Main app background           |
| `surface` / `surfaceElevated`                          | Cards, sheets, elevated areas |
| `border` / `borderSubtle`                              | Dividers, borders             |
| `text` / `textSecondary` / `textMuted` / `textInverse` | Text hierarchy                |
| `primary` / `primaryMuted` / `primaryContrast`         | Main brand (green)            |
| `secondary` / `secondaryMuted`                         | Purple accent                 |
| `accent` / `accentMuted`                               | Blue accent                   |
| `success` / `error` / `warning` / `info` (+ Muted)     | Status                        |
| `touchableHighlight` / `touchableActive`               | Press states                  |

Adding a new screen: use `ThemedView`/`ThemedText` and, when needed, `colors.*` from `useTheme()`. Do **not** hardcode `#10B981` or `#000` in screens; use `colors.primary` and `colors.text` so light/dark stay in sync.

## Responsiveness (all mobile screens)

**Rule: use `useResponsive()` for spacing, font sizes, and breakpoint-based layout.**

- **`src/constants/layout.ts`** — `BASE_SCREEN_WIDTH` (390), `BASE_SCREEN_HEIGHT` (844), `BREAKPOINTS` (sm/md/lg). Design is assumed to be for this reference size.
- **`src/utils/responsive.ts`** — Pure scaling: `horizontalScale`, `verticalScale`, `moderateScale`, `fontScale`, `isAtBreakpoint`.
- **`useResponsive()`** — Hook (uses `useWindowDimensions`) that returns:
  - **`hs(size)`** — horizontal scale (padding, margin, width).
  - **`vs(size)`** — vertical scale (vertical spacing, top/bottom padding).
  - **`ms(size, factor?)`** — moderate scale (icons, buttons; factor 0.5 = less aggressive).
  - **`fs(size, maxScale?)`** — font scale (capped by default so text doesn’t get huge on tablets).
  - **`width` / `height`** — current window dimensions.
  - **`isSmallScreen` / `isMediumScreen` / `isLargeScreen`** — boolean breakpoints.
  - **`isAtBreakpoint('sm'|'md'|'lg')`** — explicit breakpoint check.

**Example (see `HomeScreen.tsx`):**

```tsx
import { useResponsive } from "../hooks/useResponsive";

function MyScreen() {
  const { hs, vs, fs } = useResponsive();

  return (
    <View style={{ padding: hs(24), paddingTop: vs(60) }}>
      <Text style={{ fontSize: fs(18), marginBottom: vs(12) }}>Title</Text>
    </View>
  );
}
```

- Use **flex** and **percentage** for layout where possible; use **hs/vs/fs** for concrete numbers (padding, fontSize, icon size).
- For different layouts by breakpoint: `if (isLargeScreen) return <TabletLayout />; return <PhoneLayout />`.

## API layer (React Query + Axios + Zustand)

Structure matches a per-domain pattern (e.g. like `business-3.0/src/services`):

- **`api/http.ts`** — `createApiClient(baseURL)`, single `paygeniusAPI` instance. Request interceptor attaches `Authorization: Bearer <token>` from `useAuthStore.getState().token`. On 401, clears auth store.
- **Per domain** (auth, home, profile, budget, wallet):
  - **`{domain}.endpoints.ts`** — `ROUTE` and `QUERY_KEY` / `MUTATION_KEY` constants.
  - **`{domain}.type.ts`** — Request/response and `ApiResponse<T>` types.
  - **`{domain}.api.ts`** — Axios calls using `paygeniusAPI`, return `response.data`.
  - **`{domain}.query.ts`** — React Query hooks: `useQuery` / `useMutation` calling the `.api` functions.

**State (Zustand):** `stores/auth.store.ts` holds `token` and `user`. Login/register APIs call `setAuth(token, user)` on success. Logout and 401 call `clearAuth()`.

**Usage in UI:** Use the query hooks (e.g. `useLoginMutation`, `useGetMeQuery`, `useGetDashboardQuery`, `useGetBudgetsQuery`). Auth state is read via `useAuthStore()` or `useAuth()` (context that composes store + `useGetMeQuery`).

- **Base URL**: `EXPO_PUBLIC_API_URL` in `.env` or default `http://localhost:5000`. For Expo Go on device, use your machine IP.
- **Routes**: Backend routes are in each domain’s `*.endpoints.ts`: `/api/auth/*`, `/api/home/dashboard`, `/api/profile/*`, `/api/budget/*`, `/api/wallet/`.

## Adding a new screen

1. Create `src/screens/MyScreen.tsx` (use `ThemedView`, `ThemedText`, `useTheme()` as above).
2. Add to `RootStackParamList` in `src/navigation/RootNavigator.tsx`.
3. Add `<Stack.Screen name="MyScreen" component={MyScreen} />`.
4. Navigate with `navigation.navigate('MyScreen')`.

## Optional: Tailwind (NativeWind)

Expo supports [NativeWind](https://www.nativewind.dev/) for Tailwind-style classes on React Native. The current setup uses **StyleSheet + theme context** so it works in Expo Go without extra config. If you add NativeWind later, you can keep the same semantic tokens by extending Tailwind’s `theme.colors` from `lightColors`/`darkColors` and using a dark-mode strategy (e.g. class or media) so one set of class names still switches with theme.
