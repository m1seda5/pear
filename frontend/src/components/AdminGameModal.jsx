import React from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  Button, FormControl, FormLabel, Input, Select, Flex, Image, useColorModeValue
} from '@chakra-ui/react';
import { FieldArray, Formik, Form, Field } from 'formik';

const initialGame = {
  home_team: '',
  home_logo: '',
  away_team: '',
  away_logo: '',
  sport: '',
  category: '',
  start_time: '',
  background_image: '',
};

const AdminGameModal = ({ isOpen, onClose, onSave, initialGames = [initialGame] }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent bg={useColorModeValue('white', 'gray.800')}>
        <ModalHeader>Schedule Games</ModalHeader>
        <ModalCloseButton />
        <Formik
          initialValues={{ games: initialGames }}
          onSubmit={(values, actions) => {
            onSave(values.games);
            actions.setSubmitting(false);
            onClose();
          }}
        >
          {({ values, setFieldValue, isSubmitting }) => (
            <Form>
              <ModalBody>
                <FieldArray name="games">
                  {({ push, remove }) => (
                    <>
                      {values.games.map((game, idx) => (
                        <Flex key={idx} gap={4} mb={6} direction="column" borderBottom="1px solid #eee" pb={4}>
                          <FormControl>
                            <FormLabel>Start Time</FormLabel>
                            <Field as={Input} name={`games[${idx}].start_time`} type="datetime-local" />
                          </FormControl>
                          <Flex gap={2}>
                            <FormControl>
                              <FormLabel>Home Team</FormLabel>
                              <Field as={Input} name={`games[${idx}].home_team`} />
                            </FormControl>
                            <FormControl>
                              <FormLabel>Logo</FormLabel>
                              <Input type="file" accept="image/*" onChange={e => setFieldValue(`games[${idx}].home_logo`, e.target.files[0])} />
                              {game.home_logo && typeof game.home_logo !== 'string' && (
                                <Image src={URL.createObjectURL(game.home_logo)} boxSize="40px" mt={2} />
                              )}
                            </FormControl>
                          </Flex>
                          <Flex gap={2}>
                            <FormControl>
                              <FormLabel>Away Team</FormLabel>
                              <Field as={Input} name={`games[${idx}].away_team`} />
                            </FormControl>
                            <FormControl>
                              <FormLabel>Logo</FormLabel>
                              <Input type="file" accept="image/*" onChange={e => setFieldValue(`games[${idx}].away_logo`, e.target.files[0])} />
                              {game.away_logo && typeof game.away_logo !== 'string' && (
                                <Image src={URL.createObjectURL(game.away_logo)} boxSize="40px" mt={2} />
                              )}
                            </FormControl>
                          </Flex>
                          <Flex gap={2}>
                            <FormControl>
                              <FormLabel>Sport</FormLabel>
                              <Field as={Select} name={`games[${idx}].sport`}>
                                <option value="">Select</option>
                                <option value="Football">Football</option>
                                <option value="Basketball">Basketball</option>
                                <option value="Hockey">Hockey</option>
                                <option value="Rugby">Rugby</option>
                              </Field>
                            </FormControl>
                            <FormControl>
                              <FormLabel>Category</FormLabel>
                              <Field as={Select} name={`games[${idx}].category`}>
                                <option value="">Select</option>
                                <option value="Boys">Boys</option>
                                <option value="Girls">Girls</option>
                              </Field>
                            </FormControl>
                          </Flex>
                          <FormControl>
                            <FormLabel>Background Image</FormLabel>
                            <Input type="file" accept="image/*" onChange={e => setFieldValue(`games[${idx}].background_image`, e.target.files[0])} />
                            {game.background_image && typeof game.background_image !== 'string' && (
                              <Image src={URL.createObjectURL(game.background_image)} boxSize="60px" mt={2} />
                            )}
                          </FormControl>
                          {values.games.length > 1 && (
                            <Button colorScheme="red" size="xs" onClick={() => remove(idx)} mt={2}>Remove</Button>
                          )}
                        </Flex>
                      ))}
                      <Button colorScheme="blue" variant="outline" onClick={() => push(initialGame)} leftIcon={'+'.repeat(1)} mb={4}>
                        Add Another Game
                      </Button>
                    </>
                  )}
                </FieldArray>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="green" mr={3} type="submit" isLoading={isSubmitting}>
                  Upload
                </Button>
                <Button onClick={onClose}>Cancel</Button>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  );
};

export default AdminGameModal; 