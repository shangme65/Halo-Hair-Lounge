# Copilot Instructions for Halo Hair Lounge Project

## Button Styling Guidelines

### Hover Effects

When editing or creating buttons in the admin portal, always apply the following standards:

1. **Smooth Transitions**: Always add `transition-shadow duration-500 ease-in-out` to all buttons for smooth hover effects.

2. **Button Hover Glow Colors by Function**:

   - **Primary/Save buttons**: Green glow - `hover:shadow-2xl hover:shadow-green-500/50`
   - **Secondary buttons (white)**: White glow with complete shadow stack
   - **Delete buttons**: Red glow with complete shadow stack
   - **Back/Cancel buttons**: Green glow with complete shadow stack
   - **Outline buttons (general)**: White or green glow depending on context

3. **Complete Shadow Stack for Bottom Glow**:
   For buttons requiring bottom glow effect (outline variant), use the full shadow definition with `!important`:

   ```
   hover:!shadow-[inset_0_2px_1px_0_rgba(255,255,255,0.6),inset_0_-3px_2px_0_rgba(0,0,0,0.25),inset_2px_0_2px_0_rgba(255,255,255,0.15),inset_-2px_0_2px_0_rgba(0,0,0,0.1),0_4px_0_0_rgba(COLOR),0_5px_0_0_rgba(COLOR),0_6px_0_0_rgba(COLOR),0_10px_12px_-3px_rgba(0,0,0,0.5),0_15px_25px_-5px_rgba(0,0,0,0.3),0_8px_16px_-4px_rgba(COLOR)]
   ```

   Replace COLOR with:

   - Green: `rgba(34,197,94,0.8)`, `rgba(34,197,94,0.6)`, `rgba(34,197,94,0.4)`, `rgba(34,197,94,0.7)`
   - White: `rgba(255,255,255,0.8)`, `rgba(255,255,255,0.6)`, `rgba(255,255,255,0.4)`, `rgba(255,255,255,0.7)`
   - Red: `rgba(239,68,68,0.8)`, `rgba(239,68,68,0.6)`, `rgba(239,68,68,0.4)`, `rgba(239,68,68,0.7)`

4. **Consistency**: All admin portal buttons should follow these standards for a unified user experience.

## Example Button Patterns

### Back Button (Green Glow)

```tsx
<Button
  variant="outline"
  className="flex items-center gap-0.5 py-1 px-1.5 text-xs h-7 transition-shadow duration-500 ease-in-out hover:!shadow-[inset_0_2px_1px_0_rgba(255,255,255,0.6),inset_0_-3px_2px_0_rgba(0,0,0,0.25),inset_2px_0_2px_0_rgba(255,255,255,0.15),inset_-2px_0_2px_0_rgba(0,0,0,0.1),0_4px_0_0_rgba(34,197,94,0.8),0_5px_0_0_rgba(34,197,94,0.6),0_6px_0_0_rgba(34,197,94,0.4),0_10px_12px_-3px_rgba(0,0,0,0.5),0_15px_25px_-5px_rgba(0,0,0,0.3),0_8px_16px_-4px_rgba(34,197,94,0.7)]"
>
```

### Delete Button (Red Glow)

```tsx
<Button
  variant="outline"
  className="flex items-center gap-0.5 py-1 text-xs h-7 text-red-600 hover:!text-white transition-shadow duration-500 ease-in-out hover:!shadow-[inset_0_2px_1px_0_rgba(255,255,255,0.6),inset_0_-3px_2px_0_rgba(0,0,0,0.25),inset_2px_0_2px_0_rgba(255,255,255,0.15),inset_-2px_0_2px_0_rgba(0,0,0,0.1),0_4px_0_0_rgba(239,68,68,0.8),0_5px_0_0_rgba(239,68,68,0.6),0_6px_0_0_rgba(239,68,68,0.4),0_10px_12px_-3px_rgba(0,0,0,0.5),0_15px_25px_-5px_rgba(0,0,0,0.3),0_8px_16px_-4px_rgba(239,68,68,0.7)]"
  style={{ color: undefined }}
>
```

### Primary/Save Button (Green Glow)

```tsx
<Button
  className="flex items-center gap-0.5 py-1 px-1.5 text-xs h-7 bg-gradient-to-r from-primary-600 to-primary-700 hover:shadow-2xl hover:shadow-green-500/50 transition-shadow duration-500 ease-in-out"
>
```
