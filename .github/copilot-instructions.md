# Mentaton - AI Coding Assistant Instructions

## Project Overview

Mentaton is a React Native quiz application built with Expo, featuring SQLite-backed question storage and a clean, gradient-based UI. The app serves trivia questions across multiple categories with difficulty levels and language support.

## Architecture & Data Flow

### Core Components Structure

- **Navigation**: Stack-based routing with `HomeScreen` → `QuestionScreen`
- **Database Layer**: SQLite with Expo SQLite, questions stored in `assets/database/questions.db`
- **UI Framework**: React Native Paper + custom components with LinearGradient backgrounds
- **State Management**: Component-level state (no Redux/Zustand)

### Key Data Flow Patterns

```typescript
// Database initialization with versioning
const db = await openDatabase(); // Handles asset copying and migrations
const question = await getRandomQuestion(category, difficulty, language);
```

### Database Schema & Operations

- **Questions Table**: `id, question, answer, category, difficulty, language`
- **Versioning**: Custom system using AsyncStorage + DB_VERSION constant
- **Normalization**: All string fields stored in lowercase for consistent querying
- **Asset Management**: Database file copied from assets on first run

## Development Workflow

### Essential Commands

```bash
npm start          # Start Expo dev server
npm run android    # Build/run Android
npm run ios        # Build/run iOS
npm run web        # Start web version
```

### Database Updates

1. Update `assets/database/questions.db`
2. Increment `DB_VERSION` in `database/index.ts`
3. Test database migration logic

### Font Integration

```typescript
// Load custom fonts in App.tsx
const [fontsLoaded] = useFonts({
  Montserrat: require("./assets/fonts/Montserrat-Bold.ttf"),
});
```

## Code Patterns & Conventions

### Component Structure

```tsx
// CustomButton pattern - image + text with shadow styling
<TouchableOpacity style={[styles.button, style]} onPress={onPress}>
  <Text style={[styles.label, { fontFamily: "Montserrat" }, labelStyle]}>
    {label}
  </Text>
  <Image source={imageSource} style={[styles.icon, iconStyle]} />
</TouchableOpacity>
```

### Navigation with TypeScript

```typescript
type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Home"
>;
const navigation = useNavigation<HomeScreenNavigationProp>();
```

### Styling Patterns

- **Fonts**: Always use `fontFamily: "Montserrat"` for consistency
- **Colors**: Primary gradient `#464eb5` to `#9629b1`, white text on gradients
- **Shadows**: Custom shadow styling with `shadowOffset: { width: 12, height: 12 }`
- **Layout**: Fixed containers with `minHeight/maxHeight` for consistent spacing

### Database Query Patterns

```typescript
// Always normalize parameters to lowercase
const rows = await db.getAllAsync<Question>(
  `SELECT * FROM questions WHERE category = ? AND difficulty = ? AND language = ?`,
  [category.toLowerCase(), difficulty.toLowerCase(), language.toLowerCase()]
);
```

## File Organization

### Key Directories

- `assets/database/` - SQLite database files
- `assets/fonts/` - Montserrat font variants
- `assets/icons/` - Category and UI icons
- `components/` - Reusable UI components
- `database/` - SQLite setup and query functions
- `navigation/` - React Navigation configuration
- `screens/` - Main app screens

### Configuration Files

- `app.json` - Expo configuration with `newArchEnabled: true`
- `tsconfig.json` - Extends `expo/tsconfig.base` with strict mode
- `package.json` - Expo SDK 53, React Native 0.79.5

## Common Patterns to Follow

### Error Handling

```typescript
try {
  const question = await getRandomQuestion(category, difficulty, language);
  // Handle success
} catch (error) {
  console.error("Error:", error);
  // Handle error gracefully
}
```

### Asset Loading

````typescript
// Images from assets
<Image source={require("../assets/icons/settings.png")} />;

### State Management

```typescript
const [currentQuestion, setCurrentQuestion] = useState<any>(null);
const [showAnswer, setShowAnswer] = useState(false);
````

## Testing & Validation

### Manual Testing Checklist

- [ ] Database migration works on fresh install
- [ ] Font loading doesn't break app startup
- [ ] Navigation flows work correctly
- [ ] SQLite queries return expected results
- [ ] UI renders properly on different screen sizes

### Build Validation

```bash
# Test all platforms
npm run android
npm run ios
npm run web
```

## Deployment

### EAS Build Configuration

- Project configured for EAS with projectId in `app.json`
- Android package: `com.mariano115.MentatonProyect`
- iOS bundle: `com.mariano115.MentatonProyect`

### Asset Optimization

- Database files excluded from git (in .gitignore)
- Images optimized for different screen densities
- Fonts loaded asynchronously to prevent startup delays

## Gotchas & Important Notes

1. **Database Versioning**: Always increment `DB_VERSION` when updating the database file
2. **Font Loading**: App shows nothing until fonts are loaded - handle this state
3. **SQLite Asset Copying**: Database is copied from assets on first run only
4. **Case Sensitivity**: All database queries normalize to lowercase
5. **Navigation Types**: Use proper TypeScript types for navigation props
6. **Shadow Styling**: Custom shadow implementation for consistent look
7. **Linear Gradients**: Consistent purple gradient across screens

## Quick Reference

### Adding New Questions

1. Update `assets/database/questions.db`
2. Increment `DB_VERSION` in `database/index.ts`
3. Test database migration

### Adding New Categories

1. Add icon to `assets/icons/`
2. Update categories array in `HomeScreen.tsx`
3. Add questions to database with matching category name

### UI Component Creation

1. Use Montserrat font family
2. Apply consistent shadow styling
3. Follow TouchableOpacity + styling pattern
4. Use proper TypeScript interfaces</content>
   <parameter name="filePath">/home/mariano115/Documents/Proyectos/MentatonProyect/.github/copilot-instructions.md
