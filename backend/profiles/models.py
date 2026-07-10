from django.db import models
from accounts.models import User


class Profile(models.Model):
    GENDER_CHOICES = [('male', 'Male'), ('female', 'Female'), ('other', 'Other')]
    RELIGION_CHOICES = [
        ('hindu', 'Hindu'), ('muslim', 'Muslim'), ('christian', 'Christian'),
        ('sikh', 'Sikh'), ('jain', 'Jain'), ('buddhist', 'Buddhist'), ('other', 'Other'),
    ]
    MARITAL_CHOICES = [
        ('never_married', 'Never Married'), ('divorced', 'Divorced'),
        ('widowed', 'Widowed'), ('separated', 'Separated'),
    ]
    EDUCATION_CHOICES = [
        ('high_school', 'High School'), ('diploma', 'Diploma'),
        ('bachelors', "Bachelor's"), ('masters', "Master's"), ('phd', 'PhD'), ('other', 'Other'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    photo = models.ImageField(upload_to='profiles/', blank=True, null=True)
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, blank=True)
    religion = models.CharField(max_length=20, choices=RELIGION_CHOICES, blank=True)
    caste = models.CharField(max_length=100, blank=True)
    mother_tongue = models.CharField(max_length=50, blank=True)
    marital_status = models.CharField(max_length=20, choices=MARITAL_CHOICES, blank=True)
    height = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    weight = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    education = models.CharField(max_length=20, choices=EDUCATION_CHOICES, blank=True)
    occupation = models.CharField(max_length=100, blank=True)
    annual_income = models.CharField(max_length=50, blank=True)
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    country = models.CharField(max_length=100, blank=True, default='India')
    about_me = models.TextField(blank=True)
    phone = models.CharField(max_length=15, blank=True)
    present_address = models.TextField(blank=True)
    # Horoscope
    zodiac_sign = models.CharField(max_length=50, blank=True)
    nakshatra = models.CharField(max_length=50, blank=True)
    birth_place = models.CharField(max_length=100, blank=True)
    birth_time = models.TimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.full_name}'s Profile"


class PartnerExpectation(models.Model):
    profile = models.OneToOneField(Profile, on_delete=models.CASCADE, related_name='expectation')
    min_age = models.IntegerField(null=True, blank=True)
    max_age = models.IntegerField(null=True, blank=True)
    min_height = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    max_height = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    religion = models.CharField(max_length=100, blank=True)
    caste = models.CharField(max_length=100, blank=True)
    education = models.CharField(max_length=100, blank=True)
    occupation = models.CharField(max_length=100, blank=True)
    marital_status = models.CharField(max_length=100, blank=True)
    location = models.CharField(max_length=200, blank=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.profile.user.full_name}'s Expectations"


class ProfileView(models.Model):
    viewer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='viewed_profiles')
    viewed = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='profile_views')
    viewed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('viewer', 'viewed')
        ordering = ['-viewed_at']
