import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  firstInvalidContactField,
  hasContactErrors,
  validateContact,
  validateContactField,
} from './contactValidation.ts';
import {
  computeLanguageSummary,
  isProject,
  parseProjects,
} from './languages.ts';

describe('validateContact (client-side validation matching /api/contact)', () => {
  it('returns errors for all three fields when empty or whitespace-only', () => {
    const errors = validateContact({
      name: '   ',
      email: '',
      message: '\n\t  ',
    });

    assert.ok(errors.name);
    assert.ok(errors.email);
    assert.ok(errors.message);
    assert.equal(hasContactErrors(errors), true);
    assert.equal(firstInvalidContactField(errors), 'name');
  });

  it('enforces name boundaries: 2 to 80 characters after trimming and stripping control characters', () => {
    assert.ok(
      validateContactField('name', 'A'),
      '1 char name should be rejected'
    );
    assert.ok(
      validateContactField('name', 'A\u0000\u0007'),
      '1 char name padded with ASCII control chars should be rejected'
    );
    assert.equal(
      validateContactField('name', 'Al'),
      undefined,
      '2 char name should be valid'
    );
    assert.equal(
      validateContactField('name', 'a'.repeat(80)),
      undefined,
      '80 char name should be valid'
    );
    assert.ok(
      validateContactField('name', 'a'.repeat(81)),
      '81 char name should be rejected'
    );
  });

  it('enforces email format and length boundaries (5 to 120 chars)', () => {
    assert.ok(validateContactField('email', 'a@b.c')); // TLD must be >= 2 chars
    assert.ok(validateContactField('email', 'correo-sin-dominio@'));
    assert.ok(validateContactField('email', 'correo@dominio'));
    assert.ok(validateContactField('email', 'espacio en@dominio.com'));
    assert.ok(
      validateContactField('email', `${'a'.repeat(110)}@dominio.com`),
      'email over 120 chars should be rejected'
    );

    assert.equal(
      validateContactField('email', '  Nombre.Apellido@Empresa.com.ar '),
      undefined
    );
  });

  it('enforces message boundaries: 10 to 2000 characters after trimming', () => {
    assert.ok(
      validateContactField('message', '123456789'),
      '9 char message should be rejected'
    );
    assert.equal(
      validateContactField('message', '1234567890'),
      undefined,
      '10 char message should be valid'
    );
    assert.equal(
      validateContactField('message', 'm'.repeat(2000)),
      undefined,
      '2000 char message should be valid'
    );
    assert.ok(
      validateContactField('message', 'm'.repeat(2001)),
      '2001 char message should be rejected'
    );
  });

  it('returns empty error object and null firstInvalidContactField for valid payload', () => {
    const errors = validateContact({
      name: 'Lautaro Ponzina',
      email: 'lautaro@dominio.com',
      message: 'Hola, te escribo para conversar sobre un puesto Full Stack.',
    });

    assert.deepEqual(errors, {});
    assert.equal(hasContactErrors(errors), false);
    assert.equal(firstInvalidContactField(errors), null);
  });

  it('identifies first invalid field in DOM order (name -> email -> message)', () => {
    const emailAndMsgErrors = validateContact({
      name: 'Lautaro',
      email: 'invalido',
      message: 'corto',
    });
    assert.equal(firstInvalidContactField(emailAndMsgErrors), 'email');

    const msgOnlyError = validateContact({
      name: 'Lautaro',
      email: 'lautaro@dominio.com',
      message: 'corto',
    });
    assert.equal(firstInvalidContactField(msgOnlyError), 'message');
  });
});

describe('parseProjects and computeLanguageSummary', () => {
  it('filters out malformed project items and entries with invalid language objects', () => {
    const raw: unknown = [
      {
        name: 'ClinAppMobile',
        title: 'ClinApp Mobile',
        description: 'Plataforma de delivery',
        html_url: 'https://github.com/Lautaro-404/ClinAppMobile',
        homepage: 'https://clinapp-mobile.vercel.app',
        topics: ['flutter'],
        languages: [{ name: 'Dart', bytes: 1000, percentage: 100 }],
        stargazers_count: 0,
        pushed_at: '2026-11-03T05:09:12Z',
        featured: true,
        order: 1,
      },
      {
        name: 'BrokenProject',
        title: 'Broken',
        description: 'Missing languages array items validation',
        html_url: 'https://github.com/Lautaro-404/Broken',
        topics: ['ts'],
        languages: [{ name: 123, bytes: 'invalid' }],
      },
      null,
      'not-an-object',
    ];

    assert.equal(isProject((raw as unknown[])[0]), true);
    assert.equal(isProject((raw as unknown[])[1]), false);

    const valid = parseProjects(raw);
    assert.equal(valid.length, 1);
    assert.equal(valid[0].name, 'ClinAppMobile');

    const summary = computeLanguageSummary(valid);
    assert.equal(summary.totalBytes, 1000);
    assert.equal(summary.stats[0].name, 'Dart');
  });
});
