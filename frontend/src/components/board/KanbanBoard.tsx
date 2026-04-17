import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ApplicationCard,  {type  JobApplicationCardData } from './ApplicationCard';

interface KanbanColumn {
  id: 'applied' | 'interviewing' | 'offered';
  title: string;
  icon: string;
  color: string;
  cards: JobApplicationCardData[];
}

interface KanbanBoardProps {
  columns: KanbanColumn[];
  onCardMove?: (cardId: string, fromColumn: string, toColumn: string) => void;
  onCardClick?: (card: JobApplicationCardData) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ columns, onCardMove, onCardClick }) => {
  const [draggedCard, setDraggedCard] = useState<{ cardId: string; fromColumn: string } | null>(
    null,
  );

  const handleDragStart = (e: React.DragEvent, cardId: string, columnId: string) => {
    setDraggedCard({ cardId, fromColumn: columnId });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, toColumnId: string) => {
    e.preventDefault();
    if (draggedCard && draggedCard.fromColumn !== toColumnId) {
      onCardMove?.(draggedCard.cardId, draggedCard.fromColumn, toColumnId);
    }
    setDraggedCard(null);
  };

  return (
    <div className="grid grid-cols-3 gap-6">
      {columns.map((column) => (
        <motion.div
          key={column.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Column Header */}
          <div className="mb-4 flex items-center gap-2">
            <span className="text-2xl">{column.icon}</span>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{column.title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {column.cards.length} {column.cards.length === 1 ? 'item' : 'items'}
              </p>
            </div>
          </div>

          {/* Drop Zone */}
          <motion.div
            className="space-y-3 min-h-96 p-4 rounded-xl bg-gradient-to-b from-gray-100 to-gray-50 dark:from-gray-800/50 dark:to-gray-900/50 border-2 border-dashed border-gray-300 dark:border-gray-700"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
            animate={{
              backgroundColor: draggedCard?.fromColumn !== column.id ? 'transparent' : 'rgba(59, 130, 246, 0.05)',
            }}
            transition={{ duration: 0.2 }}
          >
            {column.cards.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500 text-sm">
                No items yet
              </div>
            ) : (
              <motion.div className="space-y-3">
                {column.cards.map((card) => (
                  <ApplicationCard
                    key={card.id}
                    card={card}
                    onDragStart={(e) => handleDragStart(e, card.id, column.id)}
                    onClick={() => onCardClick?.(card)}
                  />
                ))}
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
};

export default KanbanBoard;
