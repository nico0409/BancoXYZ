module.exports = {
    root: true,
    extends: [
        'universe/native',
        'plugin:@typescript-eslint/recommended',
        'plugin:react-hooks/recommended',
    ],
    plugins: ['import'],
    rules: {
        'import/order': [
            'error',
            {
                groups: ['builtin', 'external', 'internal', ['parent', 'sibling']],
                'newlines-between': 'always',
                alphabetize: { order: 'asc', caseInsensitive: true },
            },
        ],
        '@typescript-eslint/no-unused-vars': 'error',
    },
};