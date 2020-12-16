import { Button, Form, InlineLoading, TextInput } from 'carbon-components-react';
import { Formik } from 'formik';
import React, { useCallback, useState } from 'react';
import { ModalBody, ModalFooter, showModal } from '../utils';

export function showCreateLinkModal<T>(
  submitFn?: (name: string, link: string) => Promise<T>
): Promise<T | undefined> {
  function ModalForm({ closeFn }: { closeFn: (v?: T) => void }) {
    const [hasSubmitted, setHasSubmitted] = useState(false);

    const validate = useCallback(({ name, link }) => {
      let errors = {};
      if (!name) {
        errors['name'] = 'Required';
      }
      if (!link) {
        errors['link'] = 'Required';
      }
      return errors;
    }, []);

    const handleSubmit = useCallback(
      async (values, { setSubmitting }) => {
        try {
          let r;
          if (submitFn) {
            r = await submitFn(values.name, values.link);
          }
          setHasSubmitted(true);
          setTimeout(() => closeFn(r), 1000);
        } catch (e) {
          console.log(e);
        } finally {
          setSubmitting(false);
        }
      },
      [closeFn]
    );

    return (
      <Formik
        initialValues={{
          name: '',
          link: '',
        }}
        validate={validate}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
          <Form onSubmit={handleSubmit} onChange={handleChange} onBlur={handleBlur}>
            <ModalBody>
              <TextInput
                id="name"
                name="name"
                labelText="Name"
                value={values.name}
                invalidText={errors.name}
                invalid={Boolean(touched.name && errors.name)}
                disabled={hasSubmitted}
              />
              <TextInput
                id="link"
                name="link"
                labelText="Link"
                placeholder="https://example.com"
                value={values.link}
                invalidText={errors.link}
                invalid={Boolean(touched.link && errors.link)}
                disabled={hasSubmitted}
              />{' '}
            </ModalBody>
            <ModalFooter>
              <Button
                kind="secondary"
                onClick={() => closeFn?.()}
                disabled={isSubmitting || hasSubmitted}
              >
                Cancel
              </Button>
              {isSubmitting || hasSubmitted ? (
                <InlineLoading
                  status={hasSubmitted ? 'finished' : 'active'}
                  description={hasSubmitted ? `Link created!` : 'Creating...'}
                />
              ) : (
                <Button kind="primary" type="submit" disabled={isSubmitting}>
                  Create
                </Button>
              )}
            </ModalFooter>
          </Form>
        )}
      </Formik>
    );
  }

  return showModal({
    modalHeading: `Create Link`,
    selectorPrimaryFocus: `#name`,
    hasForm: true,
    renderBodyFooter: (close) => <ModalForm closeFn={close} />,
  });
}
