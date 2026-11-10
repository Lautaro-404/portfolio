import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  firstInvalidContactField,
  hasContactErrors,
  validateContact,
  validateContactField,
} from './contactValidation.ts';

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

  it('enforces name boundaries: 2 to 80 characters after trimming', () => {
    assert.ok(
      validateContactField('name', 'A'),
      '1 char name should be rejected'
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
