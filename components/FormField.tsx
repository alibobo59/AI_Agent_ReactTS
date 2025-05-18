import React from 'react';
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Controller, FieldValues, Control, Path } from 'react-hook-form';

interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder: string;
  type?:
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'date'
    | 'time'
    | 'datetime-local'
    | 'week'
    | 'month'
    | 'color'
    | 'file'
    | 'image'
    | 'audio'
    | 'video'
    | 'range'
    | 'search'
    | 'url'
    | 'tel'
    | 'textarea';
}

const FormField = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = 'text',
}: FormFieldProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormItem className="w-full">
          <FormLabel className="label">{label}</FormLabel>
          <FormControl>
            <Input
              placeholder={placeholder}
              type={type}
              className="input" // Apply .form .input styles
              {...field}
            />
          </FormControl>
          {fieldState.error && <FormMessage />}
          {name === 'name' && (
            <FormDescription className="text-muted-foreground">
              This is your public display name.
            </FormDescription>
          )}
        </FormItem>
      )}
    />
  );
};

export default FormField;
