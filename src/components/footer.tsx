export default function Footer() {
  return (
    // Sticky footer at bottom of the page:
    // Place footer at the bottom of the page using margin-top: auto
    // To place footer at bottomer of the page, use flexbox with flex-direction: column on the parent container
    <footer className="border-t border-black/5 py-5 mt-auto">
      <small className="opacity-50">&copy; 2024 VM. All rights reserved.</small>
    </footer>
  );
}
