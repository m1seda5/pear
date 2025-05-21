import { Box, Button, Flex, FormControl, FormLabel, Input, Text, Textarea, useToast, VStack, Table, Thead, Tbody, Tr, Th, Td, IconButton, useColorModeValue } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";

const DailyQuestionEditPage = () => {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({ question: "", correct: "", false1: "", false2: "", false3: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await fetch("/api/daily-question/all", { credentials: "include" });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setQuestions(data);
    } catch (error) {
      toast({
        title: t("Error"),
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (questions.length >= 30) {
      toast({
        title: t("Error"),
        description: t("Maximum 30 questions allowed"),
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    const options = [newQuestion.correct, newQuestion.false1, newQuestion.false2, newQuestion.false3];
    if (options.some(opt => !opt.trim())) {
      toast({
        title: t("Error"),
        description: t("All answer fields are required"),
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    const payload = {
      question: newQuestion.question,
      options,
      answer: newQuestion.correct
    };
    try {
      const res = await fetch("/api/daily-question/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setQuestions([...questions, data.dq]);
      setNewQuestion({ question: "", correct: "", false1: "", false2: "", false3: "" });
      toast({
        title: t("Success"),
        description: t("Question added successfully"),
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: t("Error"),
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEdit = async (id) => {
    try {
      const res = await fetch(`/api/daily-question/edit/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newQuestion),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setQuestions(questions.map(q => q._id === id ? data.dq : q));
      setEditingId(null);
      setNewQuestion({ question: "", correct: "", false1: "", false2: "", false3: "" });
      toast({
        title: t("Success"),
        description: t("Question updated successfully"),
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: t("Error"),
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/daily-question/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setQuestions(questions.filter(q => q._id !== id));
      toast({
        title: t("Success"),
        description: t("Question deleted successfully"),
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: t("Error"),
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={8} maxW="1200px" mx="auto">
      <Flex justify="space-between" align="center" mb={8}>
        <Text fontSize="2xl" fontWeight="bold">{t("Daily Questions Management")}</Text>
        <Button onClick={() => navigate(-1)}>{t("Back")}</Button>
      </Flex>

      <Box bg={bgColor} p={6} borderRadius="lg" borderWidth="1px" borderColor={borderColor} mb={8}>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>{t("Question")}</FormLabel>
              <Textarea
                value={newQuestion.question}
                onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                placeholder={t("Enter your question")}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>{t("Correct Answer (A)")}</FormLabel>
              <Input
                value={newQuestion.correct}
                onChange={(e) => setNewQuestion({ ...newQuestion, correct: e.target.value })}
                placeholder={t("Enter the correct answer")}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>{t("False Answer (B)")}</FormLabel>
              <Input
                value={newQuestion.false1}
                onChange={(e) => setNewQuestion({ ...newQuestion, false1: e.target.value })}
                placeholder={t("Enter a false answer")}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>{t("False Answer (C)")}</FormLabel>
              <Input
                value={newQuestion.false2}
                onChange={(e) => setNewQuestion({ ...newQuestion, false2: e.target.value })}
                placeholder={t("Enter a false answer")}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>{t("False Answer (D)")}</FormLabel>
              <Input
                value={newQuestion.false3}
                onChange={(e) => setNewQuestion({ ...newQuestion, false3: e.target.value })}
                placeholder={t("Enter a false answer")}
              />
            </FormControl>
            <Button type="submit" colorScheme="purple" width="full">
              {editingId ? t("Update Question") : t("Add Question")}
            </Button>
          </VStack>
        </form>
      </Box>

      <Box bg={bgColor} p={6} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
        <Text fontSize="xl" fontWeight="bold" mb={4}>{t("Existing Questions")}</Text>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>{t("Question")}</Th>
              <Th>{t("Answer")}</Th>
              <Th>{t("Date")}</Th>
              <Th>{t("Actions")}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {questions.map((q) => (
              <Tr key={q._id}>
                <Td>{q.question}</Td>
                <Td>{q.answer}</Td>
                <Td>{new Date(q.date).toLocaleDateString()}</Td>
                <Td>
                  <IconButton
                    icon={<EditIcon />}
                    aria-label={t("Edit")}
                    mr={2}
                    onClick={() => {
                      setEditingId(q._id);
                      setNewQuestion({ question: q.question, correct: q.answer, false1: "", false2: "", false3: "" });
                    }}
                  />
                  <IconButton
                    icon={<DeleteIcon />}
                    aria-label={t("Delete")}
                    colorScheme="red"
                    onClick={() => handleDelete(q._id)}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default DailyQuestionEditPage; 