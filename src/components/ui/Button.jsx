import React from 'react'

const variants = {
  'primary-blue':  'btn-primary-blue',
  'primary-green': 'btn-primary-green',
  'secondary':     'btn-secondary',
  'ghost':         'btn-ghost',
}

const sizes = {
  sm:  'text-sm px-4 py-2',
  md:  'text-base px-6 py-3',
  lg:  'text-lg px-8 py-4',
}

export default function Button({
  variant = 'primary-blue',
  size = 'md',
  as: Tag = 'button',
  href,
  className = '',
  children,
  ...props
}) {
  const cls = `${variants[variant] ?? ''} ${size !== 'md' ? sizes[size] : ''} ${className}`
  if (href) {
    return <a href={href} className={cls} {...props}>{children}</a>
  }
  return <Tag className={cls} {...props}>{children}</Tag>
}
