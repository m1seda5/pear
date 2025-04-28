import React, { useEffect, useState, useRef } from "react";
import { Box, Button, Input, Textarea, Flex, IconButton, useToast, useColorModeValue } from "@chakra-ui/react";
import { CloseIcon, DeleteIcon } from "@chakra-ui/icons";
import { useMediaQuery } from "@chakra-ui/react";

const DEFAULT_POSITION = { top: 100, left: window.innerWidth - 340 };

const NotelyWidget = ({ isOpen: isOpenProp, setIsOpen: setIsOpenProp, fixed }) => {
  const [internalOpen, setInternalOpen] = useState(() => {
    return sessionStorage.getItem("notelyClosed") !== "true";
  });
  const isOpen = typeof isOpenProp === "boolean" ? isOpenProp : internalOpen;
  const setIsOpen = setIsOpenProp || setInternalOpen;
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const toast = useToast();
  const [isLargerThan1024] = useMediaQuery("(min-width: 1024px)");

  // Draggable state
  const [position, setPosition] = useState(() => {
    const saved = localStorage.getItem("notelyPosition");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_POSITION;
      }
    }
    return DEFAULT_POSITION;
  });
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const widgetBg = useColorModeValue("#ffe066", "#232323"); // softer yellow for light, dark card for dark
  const noteBg = useColorModeValue("white", "#2d2d2d");
  const noteText = useColorModeValue("#46180f", "#ffe066");
  const inputBg = useColorModeValue("white", "#232323");
  const inputText = useColorModeValue("#46180f", "#ffe066");

  useEffect(() => {
    if (isOpen) fetchNotes();
  }, [isOpen]);

  useEffect(() => {
    if (!dragging) return;
    const handleMouseMove = (e) => {
      setPosition(pos => {
        const newPos = {
          left: Math.min(Math.max(0, e.clientX - dragOffset.current.x), window.innerWidth - 380),
          top: Math.min(Math.max(0, e.clientY - dragOffset.current.y), window.innerHeight - 80)
        };
        localStorage.setItem("notelyPosition", JSON.stringify(newPos));
        return newPos;
      });
    };
    const handleMouseUp = () => setDragging(false);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]);

  const startDrag = (e) => {
    setDragging(true);
    const widget = document.getElementById("notely-widget");
    const rect = widget.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const fetchNotes = async () => {
    try {
      const res = await fetch("/api/notes", { credentials: "include" });
      const data = await res.json();
      setNotes(data);
    } catch (e) {
      toast({ title: "Failed to load notes", status: "error" });
    }
  };

  const handleSave = async () => {
    if (!title && !content) return;
    try {
      let res, data;
      if (editingId) {
        res = await fetch(`/api/notes/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ title, content })
        });
      } else {
        res = await fetch(`/api/notes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ title, content })
        });
      }
      data = await res.json();
      if (res.ok) {
        setTitle("");
        setContent("");
        setEditingId(null);
        fetchNotes();
        toast({ title: "Note saved", status: "success" });
      } else {
        throw new Error(data.error || "Failed to save note");
      }
    } catch (e) {
      toast({ title: e.message, status: "error" });
    }
  };

  const handleEdit = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditingId(note._id);
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
        credentials: "include"
      });
      if (res.ok) {
        fetchNotes();
        if (editingId === id) {
          setTitle("");
          setContent("");
          setEditingId(null);
        }
        toast({ title: "Note deleted", status: "info" });
      } else {
        throw new Error("Failed to delete note");
      }
    } catch (e) {
      toast({ title: e.message, status: "error" });
    }
  };

  useEffect(() => {
    if (isOpen) sessionStorage.setItem("notelyClosed", "false");
  }, [isOpen]);

  if (!fixed && (!isLargerThan1024 || !isOpen)) return null;

  return (
    <Box
      id="notely-widget"
      position="fixed"
      left={position.left + "px"}
      top={position.top + "px"}
      zIndex={2000}
      w="320px"
      bg={widgetBg}
      borderRadius="16px"
      p={4}
      boxShadow="2xl"
      border="none"
      cursor={dragging ? "grabbing" : "default"}
      userSelect={dragging ? "none" : "auto"}
    >
      <Flex justify="space-between" align="center" mb={2} onMouseDown={startDrag} style={{ cursor: "grab" }}>
        <Box fontWeight="bold" fontSize="xl" color={noteText}>Notely</Box>
        <IconButton icon={<CloseIcon />} size="sm" onClick={() => setIsOpen(false)} aria-label="Close" bg="transparent" _hover={{ bg: widgetBg }} />
      </Flex>
      <Input
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        mb={2}
        bg={inputBg}
        color={inputText}
        fontWeight="bold"
        borderRadius="md"
      />
      <Textarea
        placeholder="Write your note..."
        value={content}
        onChange={e => setContent(e.target.value)}
        mb={2}
        bg={inputBg}
        color={inputText}
        borderRadius="md"
        minH="80px"
      />
      <Flex gap={2} mb={3}>
        <Button colorScheme="yellow" onClick={handleSave} flex={1}>
          {editingId ? "Update" : "Save"}
        </Button>
        {editingId && (
          <Button onClick={() => { setTitle(""); setContent(""); setEditingId(null); }} flex={1}>
            Cancel
          </Button>
        )}
      </Flex>
      <Box maxH="140px" overflowY="auto">
        {notes.map(note => (
          <Box key={note._id} bg={noteBg} borderRadius="md" p={2} mb={2} boxShadow="sm" cursor="pointer" onClick={() => handleEdit(note)}>
            <Flex justify="space-between" align="center">
              <Box>
                <Box fontWeight="bold" color={noteText}>{note.title || "Untitled"}</Box>
                <Box fontSize="sm" color={noteText}>{note.content?.slice(0, 60)}</Box>
              </Box>
              <IconButton icon={<DeleteIcon />} size="sm" colorScheme="red" variant="ghost" onClick={e => { e.stopPropagation(); handleDelete(note._id); }} aria-label="Delete" />
            </Flex>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default NotelyWidget;