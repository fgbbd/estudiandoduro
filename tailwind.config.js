module.exports = {
    theme: {
      extend: {
        colors: {
          'background': '#1e1e2e',
          'text': '#cdd6f4',
        },
        animation: {
          bounceIn: 'bounceIn 0.8s ease-out forwards',
        },
        keyframes: {
          bounceIn: {
            '0%': { transform: 'translateY(60px)', opacity: '0' },
            '60%': { transform: 'translateY(-10px)' },
            '100%': { transform: 'translateY(0)', opacity: '1' },
          }
      }
    }
  }
}