'use client';

export default function DeleteButton({ 
  action, 
  confirmMessage = 'Are you sure you want to delete this record?', 
  label = 'Delete',
  style = {}
}: { 
  action: (id: string) => Promise<void>, 
  confirmMessage?: string,
  label?: string,
  style?: React.CSSProperties
}) {
  return (
    <form action={action} onSubmit={(e) => {
      if(!confirm(confirmMessage)) e.preventDefault();
    }}>
      <button 
        type="submit" 
        style={{ 
          background: 'none', 
          border: 'none', 
          cursor: 'pointer', 
          fontSize: '0.9rem', 
          fontWeight: '600',
          ...style 
        }}
      >
        {label}
      </button>
    </form>
  );
}
